#!/bin/zsh
cd "$(dirname "$0")"
echo "📤 Публикую на GitHub..."
git add index.html app.jsx components.jsx data.js assets/ .gitignore
git commit -m "Update: $(date '+%d.%m.%Y %H:%M')"
git push origin master
echo ""
echo "✅ Готово! Сайт обновится через ~1 минуту."
echo "🔗 https://hodasdrawcoin.github.io/guli-tracker"
echo ""
read -k 1 "?Нажми любую клавишу чтобы закрыть..."
