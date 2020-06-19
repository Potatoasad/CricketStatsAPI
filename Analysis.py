import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json


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

from functools import reduce
def join_dfs(ldf, rdf, on):
    return ldf.merge(rdf, how='left',on=on)

def PullData(Players,OverRange,ByButton,Metric,DelRange):
    MainCols = [ 'PlayerId', 'PlayerName', 'Full name', 'Team',
       'Batting style', 'Bowling style','TotalRuns','MatchesPlayed']
    
    if type(Players) != type(['justalistto check']):
        Players = [Players]
    
    filters = ad.Batsman.isin(Players)
    filters = filters & (ad.Delivery >= OverRange[0]) & (ad.Delivery <= OverRange[1])
    filters = filters & (ad.BatsmanBalls >= DelRange[0]) & (ad.BatsmanBalls <= DelRange[1])
    chose = ad[filters]
    
    bys = ['Batsman']
    if ByButton == 'BowlerType':
        bys = bys + ['Bowling style']
    if ByButton == 'BowlingTeam':
        bys = bys + ['BowlingTeam']
    if ByButton == 'WinLose':
        bys = bys + ['BattingTeamWon']
        
    chose = chose.groupby(bys).apply(Funcs[Metric]).reset_index().rename(index=str,columns={0:Metric})
    
    a = chose.groupby('Batsman')
    data = []
    for i,j in a:
        final = {}
        #final["By"] = ByButton;
        final["Player"] = i;
        #final["Metric"] = Metric
        Values = list(j[Metric].values);
        if ByButton != "None":
            ByLabels = list(j[ByButton].values)
            MetricValues = [{"Label":ByLabels[i], "Value": m.item()} for i,m in enumerate(Values)]
        else:
            ByLabels = "N/A"
            MetricValues = [{"Label":ByLabels, "Value": m.item()} for i,m in enumerate(Values)]
        final["MetricValues"] = MetricValues
        data.append(final)
    return data

def Table(Players,OverRange,ByButton,Column1,Column2,DelRange):
    MainCols = [ 'PlayerId', 'PlayerName', 'Full name', 'Team',
       'Batting style', 'Bowling style','TotalRuns','MatchesPlayed']
    #Players = Players.split(', ')
    #if type(Players) != type(['justalistto check']):
    #    Players = [Players]
    filters = ad.Batsman.isin(Players)
    filters = filters & (ad.Delivery >= OverRange[0]) & (ad.Delivery <= OverRange[1])
    filters = filters & (ad.BatsmanBalls >= DelRange[0]) & (ad.BatsmanBalls <= DelRange[1])
    
    chose = ad[filters]
    bywinlose = True
    
    bys = ['Batsman']
    if ByButton == 'Bowlertype':
        bys = bys + ['Bowling style']
    if ByButton == 'Bowlingteam':
        bys = bys + ['BowlingTeam']
    if ByButton == 'WinLose':
        bys = bys + ['BattingTeamWon']
    if ByButton == 'None':
        pass
        
    col1 = chose.groupby(bys).apply(Funcs[Column1]).reset_index().rename(index=str,columns={0:Column1})
    col2 = chose.groupby(bys).apply(Funcs[Column2]).reset_index().rename(index=str,columns={0:Column2})
    
    dels = chose.groupby(bys).apply(Funcs['Del']).reset_index().rename(index=str,columns={0:'Deliveries'})
    bowlers = chose.groupby(bys).apply(Funcs['BowlersFaced']).reset_index().rename(index=str,columns={0: 'BowlersFaced'})
    things = [col1,col2,dels,bowlers]
    j = lambda x,y: join_dfs(x,y,on=bys)
    chose = reduce(j, things)
    return chose
