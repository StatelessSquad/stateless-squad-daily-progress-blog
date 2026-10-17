.PHONY: setup dev test lint
setup: ## install toolchain + hooks (edit for your stack)
	@command -v pre-commit >/dev/null || pipx install pre-commit || pip install --user pre-commit
	@pre-commit install
dev: ## run locally
	@echo "TODO: define dev for {{STACK}}"
test: ## run tests
	@echo "TODO: define test for {{STACK}}"
lint: ## lint
	@pre-commit run -a
