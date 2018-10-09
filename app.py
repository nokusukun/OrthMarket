from flask import Flask, render_template, abort, url_for, request, flash, session, redirect, send_from_directory, jsonify

from includes.utils import sign
from includes.rainbowsocks.rainbowsocks import RainbowSocksClient
from includes import tasho

import datetime

app = Flask('faucet-app', static_url_path='')
faucet_wallet = sign.Key("4a4c90c69cb27b07650d05763dcebb612fa414c3dd06284086deed464a0866d9")

@app.route("/")
def index():
    return send_from_directory("templates","index.html")

@app.route("/request/<address>")
def request_wallet(address):
    pass

app.run(host="0.0.0.0", port=80)