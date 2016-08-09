import os
import random
import time

import simplejson as json
import flask
from flask import Flask
from flask import request


abs_path = os.path.realpath(__file__)
config_path = os.path.join(os.path.dirname(abs_path), "config.json")
app = Flask(__name__)

#available_accounts = [
#        ["13000000001", "123456"],
#        ["13000000002", "123456"],
#        ["13000000003", "123456"],
#]
#accounts_in_use = [
#        ["13000000004", "123456", 1470715522],
#        ["13000000005", "123456", 1470645712],
#]

def _get_config():
    '''
    Get accounts configuration from "config.json"
    '''
    with open(config_path, "r") as f:
        content = json.load(f)
    return content["available_accounts"], content["accounts_in_use"]

def _write_config(available_accounts, accounts_in_use):
    '''
    Write current accounts config into "config.json"
    '''
    content = {
            "available_accounts": available_accounts,
            "accounts_in_use": accounts_in_use
    }
    with open(config_path, "w") as f:
        json.dump(content, f, indent=4)

def _random_get():
    '''
    Get an available account from "available_accounts" randomly
    '''
    available_accounts, accounts_in_use = _get_config()
    try:
        target = random.choice(available_accounts)
        available_accounts.remove(target)
        accounts_in_use.append(target+[int(time.time())])
        _write_config(available_accounts, accounts_in_use)
        return target
    except IndexError:
        return "No available accounts now."

def _auto_free():
    '''
    Free some used account according to the period it held for
    '''
    cur_time = int(time.time())
    available_accounts, accounts_in_use = _get_config()
    affected_accounts = []
    for account in accounts_in_use:
        if (cur_time - account[2]) > 1800:
            available_accounts.append(account[:2])
            affected_accounts.append(account)
    for account in affected_accounts:
        accounts_in_use.remove(account)
    _write_config(available_accounts, accounts_in_use)

def _free_account(cellnum):
    '''
    Free some used account according to cell number
    '''
    available_accounts, accounts_in_use = _get_config()
    for account in accounts_in_use:
        if account[0] == cellnum:
            available_accounts.append(account[:2])
            accounts_in_use.remove(account)
            _write_config(available_accounts, accounts_in_use)
            return

def _free_all():
    '''
    Free all used accounts
    '''
    available_accounts, accounts_in_use = _get_config()
    for account in accounts_in_use:
        available_accounts.append(account[:2])
    accounts_in_use = []
    _write_config(available_accounts, accounts_in_use)

@app.route('/all', methods=["GET"])
def show_all_accounts():
    available_accounts, accounts_in_use = _get_config()
    resp = {"available_accounts": available_accounts, "accounts_in_use": accounts_in_use}
    return flask.jsonify(resp)

@app.route('/get_account.json', methods=["POST"])
def get_account():
    _auto_free()
    resp = _random_get()
    return flask.jsonify(resp)

@app.route('/free.json', methods=["POST"])
def free():
    cellnum = request.get_json(force=True)
    cellnum = cellnum["cell"]
    _free_account(cellnum)
    return "%s is free now." %cellnum

@app.route('/free_all.json', methods=["POST"])
def free_all():
    _free_all()
    return "All accounts available now."

if __name__ == "__main__":
    app.run()
