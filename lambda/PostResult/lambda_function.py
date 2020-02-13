import json
import pymysql
import db_config
import sys
import sendEmail

RDS_HOST  = db_config.RDS_HOST
PASSWORD = db_config.RDS_PW
NAME = db_config.RDS_USER
DB_NAME = db_config.RDS_DB


"""
    Function insert user information to RDS and sends response data to FCN
    
    param:
        body -> dictionary
        cur -> pymysql.connect.cursor()
"""
def executeStmt(body, cur):
    firstName = body['firstName']['value']
    lastName = body['lastName']['value']
    email = body['email']['value']
    primaryNumber = body['primaryNumber']['value']
    secondaryNumber = body['secondaryNumber']['value']
    morning = 1 if body['bestContactMorning'] else 0
    afternoon = 1 if body['bestContactAfternoon'] else 0
    evening = 1 if body['bestContactEvening'] else 0
    firstDate = body['firstDate']['value']
    firstTime = body['firstTime']['value']
    secondTime = body['secondTime']['value']
    secondDate = body['secondDate']['value']
    thirdTime = body['thirdTime']['value']
    thirdDate = body['thirdDate']['value']
    termsAgree = 1 if body['termsAgree'] else 0
    lastId = int(body['lastId'])
    
    userInfo = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "primaryNumber": primaryNumber,
        "secondaryNumber": secondaryNumber,
        'morning': '' if morning == 0 else 'morning',
        'afternoon': '' if afternoon == 0 else 'afternoon',
        'evening': '' if evening == 0 else 'evening',
        'firstDate': firstDate,
        'firstTime': firstTime,
        'secondDate': secondDate,
        'secondTime': secondTime,
        'thirdDate': thirdDate,
        'thirdTime': thirdTime
    }
    
    stmt = '''
        INSERT INTO userInfo(email, user_id, first_name, last_name, primary_number, 
             secondary_number, contact_morning, contact_afternoon, contact_evening, 
             first_date, first_time, second_date, second_time, third_date, third_time, 
             terms_agreement)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    '''
    
    # cur.execute(stmt, (email, lastId, firstName, lastName, primaryNumber, secondaryNumber, morning, afternoon, evening, firstDate, firstTime, secondDate, secondTime, thirdDate, thirdTime, termsAgree))
    cur.execute("select * from userResponse where user_id = (%s)", (lastId))
    data = cur.fetchone()
    cur.execute("select * from question")
    qData = cur.fetchall()
    print(qData)
    sendEmail.send(userInfo, data[1:], [n[1] for n in qData])
    
    print(data)
#---------------------------------------------------------- End of executeStmt()

"""
    Posts result to RDS
    
    param: 
        body -> dict
    return:
        none
"""
def postResult(body):
    try:
        conn = pymysql.connect(RDS_HOST, user = NAME, passwd = PASSWORD, db = DB_NAME,
        connect_timeout=5, port = 3306)
        print("connected the mysql!")
    except:
        print("ERROR: Could not connect to MySQL instance.")
        sys.exit()
        
    cur = conn.cursor()
    executeStmt(body, cur)
    conn.commit()
    conn.close()
#---------------------------------------------------------- End of postResult()

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
    # print(event)
    data = postResult(event)
    response["body"] = "Success!"
    # # print(response)

    return response
