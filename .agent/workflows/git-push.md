---
description: Commit and push all changes to the GitHub repository after edits
---

# Git Push Workflow

After making edits to the project, follow these steps to commit and push changes:

## Prerequisites
- Git must be installed and available in PATH
- Remote "origin" should be set to: https://github.com/douzakaria1998-stack/awliya.git

## Steps

// turbo-all

1. Refresh the PATH to pick up newly installed tools:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

2. Check if git repo is initialized, if not initialize it:
```powershell
if (-not (Test-Path ".git")) { git init }
```

3. Check if remote origin exists, if not add it:
```powershell
$remotes = git remote
if ($remotes -notcontains "origin") { git remote add origin https://github.com/douzakaria1998-stack/awliya.git } else { git remote set-url origin https://github.com/douzakaria1998-stack/awliya.git }
```

4. Stage all changes:
```powershell
git add -A
```

5. Commit with a descriptive message (replace the message as appropriate):
```powershell
git commit -m "Update project files"
```

6. Push to the main branch (use --force for first push or if needed):
```powershell
git push -u origin main
```

If the branch is "master" instead of "main", use:
```powershell
git branch -M main
git push -u origin main
```
