import psycopg2

def try_connect(region):
    url = f'postgresql://postgres.znvlhqywgnqpcervbnfk:MARVELS%405linkedin-pASSWORD@aws-0-{region}.pooler.supabase.com:6543/postgres'
    print(f'Trying region: {region}...')
    try:
        conn = psycopg2.connect(url, connect_timeout=3)
        conn.close()
        print(f'SUCCESS! Region is {region}')
        return url
    except Exception as e:
        print(f'Failed for {region}: {str(e).splitlines()[0]}')
        return None

regions = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-south-1',
    'sa-east-1',
    'ca-central-1'
]

working_url = None
for r in regions:
    working_url = try_connect(r)
    if working_url:
        print("FOUND URL:", working_url.replace("MARVELS%405linkedin-pASSWORD", "***"))
        break
