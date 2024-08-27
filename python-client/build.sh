#https://packaging.python.org/en/latest/flow/
rm  ./dist/*
python -m build --sdist .
python3 -m build --wheel .
python -m hatch publish ./dist/metrics_accumulator_client-* #Using tokens check $HOME/.pypirc