#!/bin/bash
source venv/bin/activate
py.test --collect-only tests/
find . -name '__pycache__' -type d -exec rm -r {} +
find . -name '*.pyc' -exec rm -f {} +
find . -name '*.pyo' -exec rm -f {} +
find . -name '*~' -exec rm -f {} +
pip3 freeze > requirements.txt
pip3 wheel --wheel-dir wheelhouse -r requirements.txt
zip -r build/test_bundle-`date "+%Y-%m-%d-%H-%M-%S"`.zip tests/ wheelhouse/ requirements.txt
