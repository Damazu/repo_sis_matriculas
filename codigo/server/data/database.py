import psycopg2

hostname = "ep-shiny-breeze-a4yhusqz-pooler.us-east-1.aws.neon.tech"
username = "default"
database = "verceldb"
pwd = "TO9ra4CmWuij"
port_id = "5432"

def get_db_connection():
    connection = psycopg2.connect(
        host=hostname, 
        user=username, 
        dbname=database, 
        password=pwd, 
        port=port_id
        )
    return connection