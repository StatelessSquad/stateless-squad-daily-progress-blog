.PHONY: setup dev test lint
setup: ## install toolchain + hooks (edit for your stack)
	@command -v pre-commit >/dev/null || pipx install pre-commit || pip install --user pre-commit
	@pre-commit install
dev: ## run locally
	@npm run dev
test: ## run tests
	@npm run build
lint: ## lint
	@pre-commit run -a
