#!/usr/bin/env python3
"""Validate activity-log entries (src/data/entries/*.json) before they reach the public blog.

Rules: strict schema; links only to PUBLIC StatelessSquad repos or their GitHub Pages sites; no secrets, tokens,
keys, IPs, emails, phone numbers, internal hosts/paths or config-repo references in any text field.
Usage: validate_entries.py [--check-public] [files...]   (default: every entry file)
  --check-public  ask the GitHub API that every referenced StatelessSquad repo exists and is public
                  (uses $GH_TOKEN or $GITHUB_TOKEN when set). Exit 1 on any violation.
Used by the blog CI (required check) and by DevEx's blog-log.sh before it opens a PR.
"""
import glob, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TYPES = {"created", "opened", "fixed", "merged", "closed", "reviewed", "published", "enabled", "updated",
         "task", "blocked", "bootstrapped"}
FIELDS = {"date": str, "time": str, "type": str, "title": str, "summary": str, "repo": (str, type(None)),
          "links": list, "model": str, "checks": str}
REQUIRED = {"date", "time", "type", "title", "summary"}
ORG = "StatelessSquad"
LINK_RE = re.compile(r"^https://(github\.com/" + ORG + r"/[A-Za-z0-9._-]+(/(pull|issues|commit|actions/runs|releases/tag)/[A-Za-z0-9._-]+)?/?"
                     r"|statelesssquad\.github\.io/[A-Za-z0-9._-]+/?)$")
FORBIDDEN = [
    (r"gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}", "GitHub token"),
    (r"\b(sk-or-v1-|sk-ant-|sk-|gsk_|nvapi-)[A-Za-z0-9_-]{16,}", "API key"),
    (r"\bAKIA[0-9A-Z]{16}\b|\bASIA[0-9A-Z]{16}\b", "AWS key"),
    (r"xox[abposr]-[A-Za-z0-9-]{10,}", "Slack token"),
    (r"\b\d{8,10}:[A-Za-z0-9_-]{30,}\b", "Telegram bot token"),
    (r"-----BEGIN [A-Z ]*PRIVATE KEY-----", "private key"),
    (r"\bocid1\.[a-z0-9.]+", "Oracle OCID"),
    (r"\b(\d{1,3}\.){3}\d{1,3}\b", "IP address"),
    (r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", "email address"),
    (r"\+\d[\d ]{8,}\d|\b05\d[- ]?\d{3}[- ]?\d{4}\b", "phone number"),
    (r"(/home/|~/|\.hermes\b|\.env\b|hermesto|oraclecloud|objectstorage|ssh-(rsa|ed25519))", "internal path, host or config repo"),
    (r"(api[_ -]?key|password|passwd|secret|token|private[_ -]?key)\s*[:=]", "credential assignment"),
    (r"\b(telegram|chat)[_ ]?(id|user)\b\s*[:=]?\s*\d{5,}", "Telegram id"),
]
FORBIDDEN = [(re.compile(p, re.I), why) for p, why in FORBIDDEN]

def visibility(repo, cache={}):
    if repo in cache: return cache[repo]
    req = urllib.request.Request(f"https://api.github.com/repos/{repo}", headers={"Accept": "application/vnd.github+json"})
    tok = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if tok: req.add_header("Authorization", f"Bearer {tok}")
    try:
        with urllib.request.urlopen(req, timeout=15) as r: cache[repo] = json.load(r).get("visibility", "unknown")
    except Exception: cache[repo] = "not-found-or-private"
    return cache[repo]

def check(path, check_public):
    errs = []
    name = os.path.basename(path)
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}-\d{4}-[a-z0-9-]{3,60}\.json", name): errs.append("file name must be YYYY-MM-DD-HHMM-slug.json")
    try: e = json.load(open(path, encoding="utf-8"))
    except Exception as x: return [f"invalid JSON: {x}"]
    if not isinstance(e, dict): return ["entry must be a JSON object"]
    for k in e:
        if k not in FIELDS: errs.append(f"unknown field '{k}'")
        elif not isinstance(e[k], FIELDS[k]): errs.append(f"field '{k}' has the wrong type")
    for k in REQUIRED - e.keys(): errs.append(f"missing field '{k}'")
    if errs: return errs
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", e["date"]): errs.append("date must be YYYY-MM-DD")
    if not re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", e["time"]): errs.append("time must be HH:MM (UTC)")
    if name[:10] != e["date"] or name[11:15] != e["time"].replace(":", ""): errs.append("file name date/time must match the entry")
    if e["type"] not in TYPES: errs.append(f"type must be one of {sorted(TYPES)}")
    if not 3 <= len(e["title"]) <= 80: errs.append("title must be 3-80 characters")
    if not 10 <= len(e["summary"]) <= 400: errs.append("summary must be 10-400 characters")
    if len(e.get("model", "")) > 60: errs.append("model must be <= 60 characters")
    if e.get("checks") not in (None, "green", "red", "n/a"): errs.append("checks must be green, red or n/a")
    repos = set()
    if e.get("repo") is not None:
        if not re.fullmatch(ORG + r"/[A-Za-z0-9._-]+", e["repo"]): errs.append(f"repo must be {ORG}/<name> or null")
        repos.add(e["repo"])
    if len(e.get("links", [])) > 6: errs.append("at most 6 links")
    for l in e.get("links", []):
        if not (isinstance(l, dict) and set(l) == {"label", "href"} and all(isinstance(v, str) for v in l.values())):
            errs.append("each link must be {label, href}"); continue
        if not LINK_RE.match(l["href"]): errs.append(f"link not allowed (public StatelessSquad repos/Pages only): {l['href']}")
        if len(l["label"]) > 60: errs.append("link label must be <= 60 characters")
        m = re.match(r"https://github\.com/(" + ORG + r"/[A-Za-z0-9._-]+)", l["href"])
        if m: repos.add(m.group(1))
    text = " ".join([e["title"], e["summary"], e.get("model", ""), e.get("repo") or ""] + [l.get("label", "") for l in e.get("links", []) if isinstance(l, dict)])
    for rx, why in FORBIDDEN:
        m = rx.search(text)
        if m: errs.append(f"forbidden content ({why}): '{m.group(0)[:24]}'")
    if check_public:
        for r in sorted(repos):
            v = visibility(r)
            if v != "public": errs.append(f"{r} is {v}: private repos must be logged anonymously (repo null, no links, no name)")
    return errs

def main(argv):
    check_public = "--check-public" in argv
    files = [a for a in argv if not a.startswith("--")] or sorted(glob.glob(os.path.join(ROOT, "src/data/entries/*.json")))
    bad = 0
    for f in files:
        for err in check(f, check_public):
            bad += 1; print(f"{os.path.relpath(f, ROOT)}: {err}")
    print(f"validated {len(files)} entr{'y' if len(files) == 1 else 'ies'}: {'OK' if not bad else f'{bad} problem(s)'}")
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
