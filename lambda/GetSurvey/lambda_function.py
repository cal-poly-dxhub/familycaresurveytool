import json
import pymysql
import db_config
import util
import realsurvey

RDS_HOST  = db_config.RDS_HOST
PASSWORD = db_config.RDS_PW
NAME = db_config.RDS_USER
DB_NAME = db_config.RDS_DB
    
"""
    Function gets survey data from the RDS.
    
    param:
        none
    return:
        respBody -> String

"""
def getSurvey():
    try:
        conn = pymysql.connect(RDS_HOST, user = NAME, passwd = PASSWORD, db = DB_NAME,
        connect_timeout=5, port = 3306)
        print("connected the mysql!")
    except:
        print("ERROR: Could not connect to MySQL instance.")
        sys.exit()
    cur = conn.cursor()
    
    stmts = '''
        SELECT a.qId, q.questions, a.aId, a.answers, a.parent
        FROM question AS q, answer AS a
        WHERE q.qId = a.qId;
    '''
    cur.execute(stmts)
    data = cur.fetchall()
    respBody = {}
    for query in data:
        qId = query[0]
        question = query[1]
        aId = query[2]
        answer = query[3]
        parent = query[4]
        print(query)
        if qId not in respBody:
            respBody[qId] = {
                "question": question,
                "aId": aId,
                "answer":[]
            }
            
        if parent and (len(respBody[qId]['answer']) == 0 or type(respBody[qId]['answer'][-1]) != dict):
            respBody[qId]['answer'].append({
                'parent': parent,
                'children': [answer]
            })
        elif parent and type(respBody[qId]['answer'][-1]) == dict :
            respBody[qId]['answer'][-1]['children'].append(answer)

        else:
            respBody[qId]['answer'].append(answer)


    conn.commit()
    conn.close()
    return respBody
#------------------------------------------------------------- End of getSurve()

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
    respBody = getSurvey()

    response["body"] = json.dumps( respBody )

    return response
