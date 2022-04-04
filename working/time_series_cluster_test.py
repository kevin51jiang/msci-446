import pandas as pd

import datetime

from tslearn.clustering import TimeSeriesKMeans

print("Reading file...")
all_df = pd.read_csv('./data.csv', low_memory=False)
print("Done reading!")
print("modifying dfs")
all_df['time'] = pd.to_datetime(all_df['timestamp'] * 1000000000)
all_df = all_df.rename({'time': 'ds', 'percentOfReleasePrice': 'y'}, axis='columns')
dfs = [v for k, v in all_df.groupby('itadPlain')]

onlyTrend = []

for df in dfs:
    onlyTrend.append(list(df['y']))


print(len(onlyTrend), len(onlyTrend[0]))
print("done modifying dfs")
seed = 555
start = datetime.datetime.now()
print("starting d run")
model = TimeSeriesKMeans(n_clusters=10, metric="dtw",
                         max_iter=10, random_state=seed, n_jobs=8)
model.fit(onlyTrend[0:100])


end = datetime.datetime.now()
print("done!", (end-start))
