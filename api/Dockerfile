FROM python:3.8.8-alpine3.12

COPY . /

RUN pip3 install -r requirements.txt
RUN echo "python3 /main.py" > /opt/docker-entrypoint.sh && chmod 755 /opt/docker-entrypoint.sh

CMD /opt/docker-entrypoint.sh