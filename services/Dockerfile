FROM python:3.10

RUN mkdir -p /opt/backend
WORKDIR /opt/backend

COPY core .
COPY services .

RUN chmod -R 555 /opt/backend

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN solc-select install all

ENV FLASK_APP=services/app.py
ENV FLASK_ENV=development

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]