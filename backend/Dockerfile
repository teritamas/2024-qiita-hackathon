FROM python:3.10-slim as builder
WORKDIR /usr/src/app
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry export -f requirements.txt > requirements.txt

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10

# pythonライブラリをインストール
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --upgrade pip &&\
  pip install -r requirements.txt --no-deps &&\
  rm -rf ~/.cache/pip

WORKDIR /
COPY ./happy_world /happy_world/

CMD uvicorn happy_world.main:app --host 0.0.0.0 --port 8080