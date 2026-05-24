import requests, json, sys

def signup():
    url = "http://127.0.0.1:8080/api/auth/signup"
    payload = {
        "name": "Test Candidate",
        "email": "testcandidate@example.com",
        "password": "password123",
        "role": "candidate",
        "applied_role": "Backend Engineer"
    }
    r = requests.post(url, json=payload)
    print('Signup status:', r.status_code)
    print('Signup response:', r.text)
    if r.status_code not in (200, 201):
        sys.exit(1)
    return r.json()["access_token"]

def login():
    url = "http://127.0.0.1:8080/api/auth/login"
    payload = {
        "email": "testcandidate@example.com",
        "password": "password123"
    }
    r = requests.post(url, json=payload)
    print('Login status:', r.status_code)
    print('Login response:', r.text)
    if r.status_code != 200:
        return None
    return r.json()["access_token"]

def get_dashboard(token):
    url = "http://127.0.0.1:8080/api/candidate/me/dashboard"
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get(url, headers=headers)
    print('Dashboard status:', r.status_code)
    print('Dashboard response:', r.text)

if __name__ == "__main__":
    token = login()
    if not token:
        print('Login failed, attempting signup')
        signup()
        token = login()
    if token:
        get_dashboard(token)
    else:
        print('Unable to obtain token')
