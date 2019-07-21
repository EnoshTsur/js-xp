def get_df(query,client):
    query_job = client.query(query)
    results = query_job.result()  # Waits for job to complete.
    df  = results.to_dataframe()
    return df
 
def main():
    # import pandas as pd
    # from google.cloud import bigquery
    # import numpy as np
    # import os
    # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r'C:\Users\moti.dabastani\Downloads\dark-influence-211808-329fcff0a1f5.json'
    # client = bigquery.Client()
    #create Df
    query="""
    SELECT sso_id,event_time,user_type,page_type,article_id,record_type,anonymous_id,brand,platform,country FROM `dark-influence-211808.raw_data.requests` WHERE DATE(event_time) BETWEEN "2019-07-15" AND "2019-07-15" 
    and SSO_ID IS NOT NULL and sso_id > 0
    LIMIT 1000
    """
    print(query)
    # df = get_df(query,client)
   
    # #sort by sso and time
    # df.sort_values(by=['sso_id','event_time'],inplace=True)
   
    # #effciency test with no groupby
    # df['time_diff'] = df['event_time'].diff(1)
   
    # df.loc[df.sso_id != df.sso_id.shift(), 'time_diff'] = np.nan
    # #Calculate request duration
    # df['row_duration'] = (df.time_diff.dt.total_seconds()/60).shift(-1)
    # #define session block
    # T = 30
    # df['new_session'] = (df['time_diff'].dt.total_seconds()/60>=T).astype(int)
    # df['s_num'] = df.groupby('sso_id')['new_session'].cumsum()
    # df['session_id'] = df['sso_id'].astype(str) + '_' + df['s_num'].astype(str)
   
    
    # df['article_id_home'] = pd.concat([df.page_type.loc[df['article_id'].isnull()],df.article_id.loc[~df['article_id'].isnull()]])
   
    # agg_dict = ({'sso_id':'first',
    #              'article_id_home' :['first','last','nunique'],
    #              'event_time':['min','max'],
    #              'row_duration':'sum',
    #              'anonymous_id':['first','nunique'],
    #              'platform':['first','nunique'],
    #              'brand':['first','last','nunique']})
    # df = df.reset_index(drop=True).sort_values(by=['session_id','event_time'])
   
    # agg_df = df.groupby('session_id').agg(agg_dict).reset_index()
    # agg_df.columns = ["_".join(x) for x in agg_df.columns.ravel()]
    # agg_df.insert(loc=0,column='session_id',value=(agg_df['sso_id_first'].astype(str).str[-4:]+agg_df['event_time_min'].apply(lambda x:np.int64(x.timestamp())).astype(str)).astype(np.int64))
    # agg_df.drop(['session_id_'],axis=1,inplace=True)
    # dataset_ref = client.dataset('analysts_playground')
    # table_ref = dataset_ref.table('sessions')
    # client.load_table_from_dataframe(agg_df, table_ref).result()   

main()