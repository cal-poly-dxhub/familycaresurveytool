import boto3
from botocore.exceptions import ClientError

# Replace sender@example.com with your "From" address.
# This address must be verified with Amazon SES.
SENDER = "fcn.noreply@gmail.com"

# Replace recipient@example.com with a "To" address. If your account 
# is still in the sandbox, this address must be verified.
RECIPIENT = "fcn.noreply@gmail.com"

# Specify a configuration set. If you do not want to use a configuration
# set, comment the following variable, and the 
# ConfigurationSetName=CONFIGURATION_SET argument below.
# CONFIGURATION_SET = "ConfigSet"

# If necessary, replace us-west-2 with the AWS Region you're using for Amazon SES.
AWS_REGION = "us-west-2"

# The subject line for the email.
SUBJECT = "Amazon SES Test (SDK for Python)"

# The email body for recipients with non-HTML email clients.
BODY_TEXT = ("Amazon SES Test (Python)\r\n"
             "This email was sent with Amazon SES using the "
             "AWS SDK for Python (Boto)."
            )
            
# The HTML body of the email.
BODY_HTML = """<html>
<head></head>
<body>
  <h1>Amazon SES Test (SDK for Python)</h1>
  <p>This email was sent with
    <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
    <a href='https://aws.amazon.com/sdk-for-python/'>
      AWS SDK for Python (Boto)</a>.</p>
</body>
</html>
"""            

# The character encoding for the email.
CHARSET = "UTF-8"

# Create a new SES resource and specify a region.
client = boto3.client('ses',region_name=AWS_REGION)

def createHTML(userInfo, answers, questions):
    bestTime = ''
    for time in (userInfo['morning'], userInfo['afternoon'], userInfo['evening']):
        bestTime += time + ","
    html = f"""
        <html>
        <head></head>
        <body>
          <h1>The Survey result of {userInfo['firstName']} {userInfo['lastName']}</h1>
          <p>
            <strong>Primay Number: </strong>
            {userInfo['primaryNumber']}
          </p>
          <p>
            <strong>Secondary Number: </strong>
            {userInfo['secondaryNumber'] if userInfo['secondaryNumber'] else 'not provided'}
          </p>
          <p>
            <strong>Email Address: </strong>
            {userInfo['email']}
          </p>
          
          <p>
            <strong>Best Time to Reach Out: </strong>
            {bestTime[:-1]}
          </p>
          <p>
            <strong>Perferred Date and Time: </strong>
                <ol>
                    <li>{userInfo['firstDate']} {userInfo['firstTime']}</li>
                    <li>{userInfo['secondDate']} {userInfo['secondTime']}</li>
                    <li>{userInfo['thirdDate']} {userInfo['thirdTime']}</li>
                </ol>
          </p>
          <ol>
    """

    
    for item in zip(answers, questions):
        html += f'<li>{item[1]} {item[0]}</li>\n'

    html+="</ol></body></html>" 
    return html


def send(userInfo, answers, questions):
    # Try to send the email.
    bodyHtml = createHTML(userInfo, answers, questions)
    print(bodyHtml)
    try:
        #Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': bodyHtml,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
            # If you are not using a configuration set, comment or delete the
            # following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
    # Display an error if something goes wrong.	
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])