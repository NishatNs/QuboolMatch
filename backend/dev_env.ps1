Write-Host "Activating virtual environment for QuboolMatch backend..." -ForegroundColor Green
& "venv_new\Scripts\Activate.ps1"

Write-Host ""
Write-Host "Virtual environment activated!" -ForegroundColor Green
Write-Host "Available commands:" -ForegroundColor Yellow
Write-Host "  uvicorn main:app --reload    (Start development server)" -ForegroundColor Cyan
Write-Host "  python migrate.py current    (Check migration status)" -ForegroundColor Cyan
Write-Host "  python migrate.py upgrade    (Apply migrations)" -ForegroundColor Cyan
Write-Host "  python -m pytest             (Run tests)" -ForegroundColor Cyan
Write-Host ""