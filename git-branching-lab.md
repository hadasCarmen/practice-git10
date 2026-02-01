# Git Branching & Conflict Resolution Lab

## Prerequisites

- Git installed on your system
- Basic understanding of `git add`, `git commit`, `git status`

---

## Part 1: Understanding Branches

### What are branches?

> Branches allow you to diverge from the main line of development and work independently without affecting the main codebase. Think of it like creating a parallel universe where you can experiment safely.

**Common use cases:**

- Developing new features without breaking production code
- Fixing bugs while others work on features
- Experimenting with ideas that might be discarded
- Multiple team members working simultaneously

---

## Exercise 1: Creating and Switching Branches

### Setup

```bash
# Create a new directory and initialize git
mkdir git-lab
cd git-lab
git init

# Create initial file
echo "# My Project" > README.md
git add README.md
git commit -m "Initial commit"
```

### Create branches

```bash
# View current branch (you're on 'main' or 'master')
git branch

# Create a new branch called 'feature-login'
git branch feature-login

# View all branches (* shows current branch)
git branch

# Switch to the new branch
git checkout feature-login
# OR use the newer command:
git switch feature-login

# Create AND switch to a branch in one command
git checkout -b feature-signup
# OR
git switch -c feature-signup
```

**Explanation:** `checkout -b` and `switch -c` are shortcuts that create a branch and immediately switch to it. The `-c` flag means "create."

---

## Exercise 2: Making Changes on Different Branches

```bash
# Make sure you're on feature-signup
git switch feature-signup

# Add a signup feature
echo "## Signup Feature" >> README.md
echo "Users can create accounts" >> README.md
git add README.md
git commit -m "Add signup feature documentation"

# Switch to feature-login
git switch feature-login

# Add login feature
echo "## Login Feature" >> README.md
echo "Users can log in with credentials" >> README.md
git add README.md
git commit -m "Add login feature documentation"

# Switch back to main
git switch main

# Check README.md - it won't have either feature!
cat README.md
```

**Key concept:** Each branch maintains its own version of files. Changes on one branch don't affect others until you merge them.

---

## Part 2: Merging Branches

### Fast-Forward Merge

**Use case:** When the target branch hasn't changed since you created your feature branch.

```bash
# Currently on main branch
git merge feature-login
```

**Explanation:** Git simply moves the main branch pointer forward to include the commits from feature-login. No merge commit is created because there's a linear history.

---

## Exercise 3: Creating a Merge Conflict

**What is a merge conflict?**
A conflict occurs when two branches modify the same part of the same file differently. Git can't automatically decide which change to keep, so it asks you to resolve it manually.

**Common scenarios:**

- Two developers edit the same function
- One person deletes a file while another modifies it
- Different formatting changes to the same lines

### Create a conflict:

```bash
# On main branch, modify README.md
echo "## Authentication System" >> README.md
echo "Version 1.0" >> README.md
git add README.md
git commit -m "Add authentication header on main"

# Try to merge feature-signup
git merge feature-signup
```

**You'll see something like:**

```
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

---

## Exercise 4: Resolving Conflicts

### View the conflict:

```bash
cat README.md
```

**You'll see conflict markers:**

```
# My Project
## Login Feature
Users can log in with credentials
<<<<<<< HEAD
## Authentication System
Version 1.0
=======
## Signup Feature
Users can create accounts
>>>>>>> feature-signup
```

**Understanding conflict markers:**

- `<<<<<<< HEAD`: Start of your current branch's changes
- `=======`: Separator between the two versions
- `>>>>>>> feature-signup`: End of the incoming branch's changes

### Resolve the conflict:

1. **Open README.md in a text editor**
2. **Decide what to keep** (you can keep one side, both, or write something new)
3. **Remove the conflict markers**

**Example resolution:**

```
# My Project
## Login Feature
Users can log in with credentials
## Authentication System
Version 1.0
## Signup Feature
Users can create accounts
```

### Complete the merge:

```bash
git add README.md
git commit -m "Merge feature-signup into main"
```

**Use case tip:** In real projects, communicate with your team when resolving conflicts to ensure you're keeping the right changes.

---

## Part 3: Git Reset

**What is reset?**
Reset moves the current branch pointer to a different commit, potentially changing your working directory and staging area.

**Three modes:**

1. **`--soft`**: Moves HEAD, keeps changes staged
2. **`--mixed`** (default): Moves HEAD, unstages changes, keeps them in working directory
3. **`--hard`**: Moves HEAD, discards all changes (DANGEROUS!)

### Exercise 5: Using Reset

```bash
# Create some commits
echo "Feature A" > feature.txt
git add feature.txt
git commit -m "Add feature A"

echo "Feature B" >> feature.txt
git add feature.txt
git commit -m "Add feature B"

echo "Feature C" >> feature.txt
git add feature.txt
git commit -m "Add feature C"

# View commit history
git log --oneline
```

### Reset --soft

**Use case:** You want to recommit your last few commits as one commit.

```bash
# Reset to 2 commits ago, keeping changes staged
git reset --soft HEAD~2

# Check status - changes are staged
git status

# You can now make a single commit
git commit -m "Add features A, B, and C"
```

### Reset --mixed (default)

**Use case:** You staged files by mistake and want to unstage them.

```bash
echo "Unwanted change" >> feature.txt
git add feature.txt

# Unstage the change
git reset HEAD feature.txt
# Same as: git reset --mixed HEAD feature.txt

# File is modified but not staged
git status
```

### Reset --hard

**Use case:** You want to completely discard commits and all changes (be very careful!).

```bash
# View history
git log --oneline

# DANGER: This will delete uncommitted work!
# Go back 1 commit and discard all changes
git reset --hard HEAD~1

# All changes from the last commit are gone
git log --oneline
```

**Warning:** `--hard` is destructive! Use it only when you're absolutely sure.

---

## Part 4: Git Revert

**What is revert?**
Revert creates a NEW commit that undoes changes from a previous commit. Unlike reset, it doesn't rewrite history.

**Key difference from reset:**

- **Reset:** Moves backward in history (rewrites history)
- **Revert:** Moves forward by creating an undo commit (preserves history)

### When to use each:


| Scenario                    | Use Reset | Use Revert |
| --------------------------- | --------- | ---------- |
| Private branch, not pushed  | ✓        |            |
| Shared/public branch        |           | ✓         |
| Want to keep history clean  |           | ✓         |
| Need to undo pushed commits |           | ✓         |

### Exercise 6: Using Revert

```bash
# Create a problematic commit
echo "Bug introduced here" > bug.txt
git add bug.txt
git commit -m "Add feature with bug"

# Create more commits
echo "Good feature" > good.txt
git add good.txt
git commit -m "Add good feature"

# View history
git log --oneline

# Revert the buggy commit (use the commit hash)
git revert <commit-hash-of-bug>
```

**What happens:**

- Git creates a new commit that removes `bug.txt`
- All subsequent commits remain in history
- Safe for shared branches because no history is rewritten

### Revert multiple commits:

```bash
# Revert the last 3 commits
git revert HEAD~2..HEAD

# This creates 3 new revert commits
```

**Use case:** Your team pushed a feature to production that breaks things. Instead of resetting (which would affect everyone), you revert to create an undo commit that everyone can pull safely.

---

## Part 5: Common Scenarios & Best Practices

### Scenario 1: Accidentally committed to wrong branch

```bash
# You're on main but should be on a feature branch
git reset --soft HEAD~1  # Undo commit, keep changes staged
git switch -c feature-new  # Create and switch to correct branch
git commit -m "Add feature on correct branch"
```

### Scenario 2: Need to undo a public commit

```bash
# NEVER use reset on pushed commits
# Use revert instead
git revert <commit-hash>
git push
```

### Scenario 3: Want to test a branch without losing your work

```bash
# Save your work without committing
git stash

# Switch and test another branch
git switch other-branch

# Come back and restore your work
git switch original-branch
git stash pop
```

### Best Practices:

1. **Commit often** with clear messages
2. **Pull before you push** to avoid conflicts
3. **Use branches** for all new work
4. **Never reset** commits that have been pushed to shared branches
5. **Communicate** with your team when resolving conflicts
6. **Test merges** in a separate branch first for complex conflicts

---

## Quick Reference

```bash
# Branching
git branch <name>              # Create branch
git switch <name>              # Switch to branch
git switch -c <name>           # Create and switch
git branch -d <name>           # Delete branch (safe)
git branch -D <name>           # Force delete branch

# Merging
git merge <branch>             # Merge branch into current

# Reset (private branches only)
git reset --soft HEAD~1        # Undo commit, keep staged
git reset --mixed HEAD~1       # Undo commit, unstage
git reset --hard HEAD~1        # Undo commit, discard changes

# Revert (safe for public branches)
git revert <commit-hash>       # Create undo commit

# Conflict resolution
git status                     # See conflicted files
# (manually edit files)
git add <file>                 # Mark as resolved
git commit                     # Complete merge
```

---

## Challenge Exercise

1. Create a branch called `feature-user-profile`
2. Add a file `profile.txt` with user profile info
3. Commit your changes
4. Switch to main and add a different `profile.txt` file
5. Try to merge `feature-user-profile` into main
6. Resolve the conflict by keeping both sets of information
7. Create one more commit, then use `git reset --soft HEAD~1` to redo it with a better message
8. Push to a remote (if you have one), then create a bad commit and use `git revert` to undo it

**Good luck!** Remember: branching and merging are skills that improve with practice. Don't be afraid to experiment in a test repository.
