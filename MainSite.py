from flask import Flask, render_template, request, jsonify, Response
import json
import pandas as pd
from Analysis import *
app = Flask(__name__)

global ad
global am
global ap

ad = pd.read_csv('data/AllDeliveries.csv');
am = pd.read_csv('data/TableOfMatches.csv');
ap = pd.read_csv('data/AllPlayers.csv');
ad = ad.drop('Unnamed: 0',axis=1)
am = am.drop('Unnamed: 0',axis=1)

Funcs = {'Power' : lambda x: x.BatsmanRuns.sum()/(((x.Runs == 0)&(x.Legal)).sum()),
'Del' : lambda x: x.Legal.sum() ,
'AverageDeliveries' : lambda x: x.Legal.sum()/(x.InningsId.nunique()),
'AverageRuns' : lambda x: x.BatsmanRuns.sum()/(x.InningsId.nunique()),
'Certainty' : lambda x: x.Legal.sum()/((x['PlayerOut'] == x.Batsman).sum()) ,
'StrikeRate': lambda x: x.BatsmanRuns.sum()*100/x.Legal.sum() ,
'BowlersFaced': lambda x: x.Bowler.nunique(),
'RotatingPercentage' : lambda x: (((x.BatsmanRuns.isin([1,2,3,5]))&(x.Legal)).sum())/(x.Legal.sum())*100,
'DotPercentage' : lambda x: (((x.BatsmanRuns.isin([0]))&(x.Legal)).sum())/(x.Legal.sum())*100};

 
@app.route('/')
def signUp():
    return render_template('crats.html')

@app.route('/data',methods=['GET'])
def DataStream():
    incoming = request.get_json()
    Players = incoming['Players']
    OverRange = incoming['OverRange']
    By = incoming['ByButton'];
    Metric = incoming['Metric'];
    DelRange = incoming['DelRange'];

    data = PullData(Players,OverRange,By,Metric,DelRange)
    response = jsonify(**{"Metric": Metric, "By":By , "PlayerData": data})
    return response;


@app.route('/teamlist', methods=['GET'])
def teamlist():
    teams = list(am.BattingFirst.unique())
    response = jsonify(**{"Teams": teams})
    return response;

@app.route('/metriclist', methods=['GET'])
def metriclist():
    columns = list(Funcs.keys())
    response = jsonify(**{"Metrics": columns})
    return response;

@app.route('/batsmanlist', methods=['GET'])
def batsmanlist():
    incoming = request.get_json()
    team = incoming['team']
    players = list(ap[ap.Team == team].PlayerName)
    response = jsonify(**{"Players": players})
    return response;

if __name__ == "__main__":
    app.run()
