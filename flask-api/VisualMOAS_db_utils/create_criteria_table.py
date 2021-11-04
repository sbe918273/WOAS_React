import mysql.connector
from config import UTILS_HOST, UTILS_USERNAME, UTILS_PASSWORD
from config import DATABASE, CRITERIA_TABLE
from criteria import SCORING, WEIGHTING, FREQUENCY

conn = mysql.connector.connect(
    host=UTILS_HOST,
    user=UTILS_USERNAME,
    password=UTILS_PASSWORD,
    database=DATABASE
)

cursor = conn.cursor()
try:
    cursor.execute("DROP TABLE {};".format(CRITERIA_TABLE))
except:
    pass

cursor.execute("""
    CREATE TABLE VisualMOAS.criteria (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, 
    topic VARCHAR(100) NOT NULL, 
    topic_weight REAL(6, 4), 
    statement VARCHAR(200) NOT NULL, 
    statement_weight REAL(6, 4),
    statement_label VARCHAR(50), 
    never_score REAL(6, 4), 
    single_score REAL(6, 4),
    multiple_score REAL(6, 4),
    true_score REAL(6, 4),
    false_score REAL(6, 4),
    setting VARCHAR(20) NOT NULL);""")

for topic in SCORING:
    if WEIGHTING[topic][0] is None:
        for idx, statement in enumerate(SCORING[topic]):
            insert_query = """ 
            INSERT INTO {0} (
                topic,
                topic_weight,
                statement,
                statement_weight,
                statement_label,
                true_score,
                false_score,
                setting) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);""".format(CRITERIA_TABLE)

            query_params = (
                topic,
                1,
                statement,
                1,
                WEIGHTING[topic][idx+1],
                1,
                0,
                "bool",
            )
            
            cursor.execute(insert_query, query_params)

    else:
        for idx, statement in enumerate(SCORING[topic]):
            insert_query = """
            INSERT INTO {} (
                topic,
                topic_weight,
                statement,
                statement_weight,
                never_score,
                single_score,
                multiple_score,
                setting) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);""".format(CRITERIA_TABLE)
            
            query_params = (
                topic,
                WEIGHTING[topic][0],
                statement,
                WEIGHTING[topic][idx+1],
                FREQUENCY[0][1],
                FREQUENCY[1][1],
                FREQUENCY[2][1],
                "freq",
            )

            cursor.execute(insert_query, query_params)

conn.commit()
conn.close()