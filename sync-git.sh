#!/usr/bin/env bash

set -euo pipefail

REPO_PATH="/mnt/projetos/Portal_SEVS"
BRANCH="main"

if [[ $# -gt 0 ]]; then
  COMMIT_MSG="$1"
else
  echo "==> Informe a mensagem do commit:"
  read -r -p "Mensagem: " COMMIT_MSG
fi

if [[ -z "$COMMIT_MSG" ]]; then
  echo "Erro: mensagem de commit não pode estar vazia."
  exit 1
fi

if [[ ! -d "$REPO_PATH/.git" ]]; then
  echo "Erro: repositório não encontrado em $REPO_PATH"
  exit 1
fi

cd "$REPO_PATH"

echo "==> Verificando status do repositório"
git status --short --branch

echo "==> Atualizando branch $BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> Adicionando alterações"
git add .

echo "==> Commitando alterações"
git commit -m "$COMMIT_MSG"

echo "==> Enviando para origin/$BRANCH"
git push origin "$BRANCH"

echo "==> Sincronização concluída com sucesso."
