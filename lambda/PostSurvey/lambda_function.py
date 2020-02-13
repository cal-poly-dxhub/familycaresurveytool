import json
import pymysql
import db_config
import sys

RDS_HOST  = db_config.RDS_HOST
PASSWORD = db_config.RDS_PW
NAME = db_config.RDS_USER
DB_NAME = db_config.RDS_DB

LIST = ['Foster Parent', 'Respite/TCP', 'Host Home', 'Mentor', 'Tutor', 'Career Mentor', 'Volunteer', 'Donate/Support']


"""
    Function adds conditional SQL statements to query points value of answers for
    each question.
    
    param:
        body -> String (JSON Object)
    return:
        stmt -> String
    
"""
def addConditional(body):
    stmt = '''
        SELECT * FROM answer
        WHERE
    '''
    
    print("this is body")
    
    res = json.loads(body)      ## since body is String, needs to import using json.loads 
    
    for answer in res:
        stmt += "(qId = " + str(answer["question"]) + " AND answers = \"" + answer["answer"] + "\") OR\n"
    
    
    return stmt[:-3]    ## leaves out last OR\n from the statement
    
#--------------------------------------------------------- End of addConditional
    
    
"""
    function will insert chosen answer linking with user id (auto incremented)
    into userResponse table.
    
    param: 
        cur -> pymysql.connect.cursor()
        data -> dictionary
    return:
        user_id -> int
"""
def insertResult(cur, data):
    answers = tuple(answer["answer"] for answer in data)    ## put answer into tuple.
    print("this is new answer")
    print(answers)
    stmt = '''
        INSERT INTO userResponse (q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    '''
    cur.execute(stmt, answers)
    cur.execute("SELECT LAST_INSERT_ID()")      ## this will get last auto incremented ID number
    
    return cur.fetchone()[0]                    ## get last inserted id from fetchone.

#--------------------------------------------------------- End of insertResult()

"""
    Function aggregates points for each answer and give rankings for best match
    
    param:
        data -> array of points (int)
    return:
        ranking -> List(int)
"""
def getRanking(data):
    ranking = [ [LIST[i], 0] for i in range(len(LIST))]
    for query in data:
        if query[4] == None: continue
        for i in range(4, len(query)):
            ranking[i-4][1] += int(query[i])
    ranking.sort(reverse=True, key=lambda x : x[1])
    return ranking
#-----------------------------------------------------------End of getRankding()

"""
    function connects to RDS and post data into the data base.
    Then it gets ranking and last inserted user id.
    Returns dictionary of finalData to be sent.
    
    param:
        body -> String (json)
        
    return:
        finalData -> dict
    
"""
def postSurvey(body):
    try:
        conn = pymysql.connect(RDS_HOST, user = NAME, passwd = PASSWORD, db = DB_NAME,
        connect_timeout=5, port = 3306)
        print("connected the mysql!")
    except:
        print("ERROR: Could not connect to MySQL instance.")
        sys.exit()
        
    cur = conn.cursor()

    stmt = addConditional(body)
    cur.execute(stmt)
    data = cur.fetchall()
    print(data)
    result = getRanking(data)
    lastId = insertResult(cur, json.loads(body))
    
    ## put final data in dictionary
    finalData = { "result" : result, "lastId": lastId }
    
    ## commits and closes the transaction with RDS
    conn.commit()
    conn.close()
    
    return finalData
#----------------------------------------------------------- End of postSurvey()

def lambda_handler(event, context):
    # TODO implement
    response = {
        "isBase64Encoded": 'false',
        "statusCode": '200',
        "headers": {
            "Accept": "*/*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Date,X-Amzn-Trace-Id,x-amz-apigw-id,x-amzn-RequestId",
        }
    }
    
    data = postSurvey(event["body"])
    response["body"] = json.dumps( data )

    return response
