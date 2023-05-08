from flask import Flask, request,jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS
import pymongo

CMD = ""

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app,cors_allowed_origins="*")

@app.route("/http-call")
def http_call():
    global CMD
    """return JSON with string data as the value"""
    data = {'data':CMD}
    return jsonify(data)
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("connect",{"data":f"id: {request.sid} is connected"})

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print(request.sid)
    print("client has connected")
    emit("connect",{"data":f"id: {request.sid} is connected"})

@socketio.on('data')
def handle_message(data):
    global CMD
    """event listener when client types a message"""
    print(data)
    
    BRAND = data['selectedBrand']
    MODEL = data['selectedModel']
    EDITION = data['selectedTrim']
    YOM = data['selectedYear']
    TRANSMISSION = data['selectedTransmissionType']
    BODY = data['selectedBodyType']
    FUEL = data['selectedFuelType']
    ENGINE = data['selectedEngine'].replace(',', '').replace('cc', '').replace(' ', '')
    MILEAGE = data['mileage']

    client = pymongo.MongoClient("mongodb+srv://root:6blVpEqG9Ke0bkwc@cluster0.7n95vwk.mongodb.net/carpriceprediction?retryWrites=true&w=majority")
    # Database Name
    db = client["carpriceprediction"]
    # Collection Name
    col = db["vehicles"]
            
    income_data = col.find({},{'_id':0, 'Brand:':1, 'Model:':1, 'Trim / Edition:':1, 'Year of Manufacture:':1, 'Condition:':1, 'Transmission:':1, 'Body type:':1, 'Fuel type:':1, 'Engine capacity:':1, 'Mileage:':1, 'Amount':1})
    data = []

    for row in income_data:
        engine_capacity = row['Engine capacity:'].replace(',', '').replace('cc', '').replace(' ', '')
        engine_capacity_rounded = round(float(engine_capacity) / 10.0) * 10
        
        if row['Brand:'] == BRAND and row['Model:'] == MODEL and row['Year of Manufacture:'] == YOM and row['Transmission:'] == TRANSMISSION and row['Body type:'] == BODY and row['Fuel type:'] == FUEL and engine_capacity_rounded == float(ENGINE) and engine_capacity_rounded == float(ENGINE):
            # Update engine capacity in row and append to filtered data
            row['Engine capacity:'] = str(engine_capacity_rounded)
            data.append(row)

    if len(data) == 1:
        # Only one data point, return the price directly
        my_mileage = float(data[0]['Mileage:'].replace(',', '').replace('km', '').replace(' ', ''))
        my_amount = float(data[0]['Amount'].replace(',', '').replace('Rs', '').replace(' ', ''))
        c=my_amount/3 #value asign for mileage
        d=c/my_mileage #my vehicle value for mileage
        d=d*float(MILEAGE)
        print("d: ",d)
        if(float(MILEAGE)>my_mileage):
            e=my_amount-d
        else:
            e=my_amount+d

        CMD = round(e / 1000.0) * 1000
        print(CMD)

        # Save CMD value to another collection in MongoDB
        cmd_collection = db["cmd_values"]  # Replace "cmd_values" with your desired collection name
        cmd_collection.replace_one({}, {'cmd_value': CMD}, upsert=True)

        emit("data",{'data':data,'id':request.sid},broadcast=True)
        return
    elif len(data) < 1:
        # No data points found
        CMD = "No data found"
        print(CMD)

        # Save CMD value to another collection in MongoDB
        cmd_collection = db["cmd_values"]  # Replace "cmd_values" with your desired collection name
        cmd_collection.replace_one({}, {'cmd_value': CMD}, upsert=True)
        
        emit("data",{'data':[],'id':request.sid},broadcast=True)
        return

    for row in data:
        row['Mileage:'] = float(row['Mileage:'].replace(',', '').replace('km', '').replace(' ', ''))
        row['Amount'] = float(row['Amount'].replace(',', '').replace('Rs', '').replace(' ', ''))

    mean_mileage = sum(row['Mileage:'] for row in data) / len(data)
    mean_amount = sum(row['Amount'] for row in data) / len(data)

    numerator = 0
    denominator = 0
    for row in data:
        numerator += (row['Mileage:'] - mean_mileage) * (row['Amount'] - mean_amount)
        denominator += (row['Mileage:'] - mean_mileage) ** 2
        
    slope = numerator / denominator
    intercept = mean_amount - slope * mean_mileage

    new_mileage = int(MILEAGE)
    new_amount = int(round((slope * new_mileage + intercept),-5))

    if(new_amount >= 200000):
        CMD = new_amount
    else:
        CMD = "Unable to predict price due to inaccurate data!"
    print(new_mileage)
    print(new_amount)
    
    emit("data",{'data':data,'id':request.sid},broadcast=True)

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True,host='0.0.0.0',port=5001)
