import os
import sys

# Ensure parent directory is in sys.path for importing project modules
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from stock_app import app
