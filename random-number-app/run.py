"""
Starts both the FastAPI backend and the React (Vite) frontend with a single command.

Usage:
    python3 run.py

Stop both with Ctrl+C.

This also works as a single PyCharm Run Configuration:
    Run -> Edit Configurations -> + -> Python
    Script path: run.py
    Working directory: project root (the folder this file is in)
"""

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"


def npm_cmd():
    # On Windows, npm is npm.cmd
    return "npm.cmd" if shutil.which("npm.cmd") else "npm"


def main():
    processes = []
    try:
        print("Starting backend (FastAPI) on http://localhost:8000 ...")
        backend = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
            cwd=BACKEND_DIR,
        )
        processes.append(backend)

        print("Starting frontend (Vite) on http://localhost:5173 ...")
        frontend = subprocess.Popen(
            [npm_cmd(), "run", "dev"],
            cwd=FRONTEND_DIR,
        )
        processes.append(frontend)

        print("\nBoth servers are starting. Press Ctrl+C to stop.\n")

        # Wait for either process to exit
        while True:
            for p in processes:
                if p.poll() is not None:
                    raise SystemExit(f"Process exited with code {p.returncode}")

    except KeyboardInterrupt:
        print("\nStopping servers...")
    finally:
        for p in processes:
            if p.poll() is None:
                p.terminate()
        for p in processes:
            try:
                p.wait(timeout=5)
            except subprocess.TimeoutExpired:
                p.kill()


if __name__ == "__main__":
    main()
