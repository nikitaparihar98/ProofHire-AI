import requests, json, time

BASE = "http://127.0.0.1:8000"

def health_check():
    r = requests.get(f"{BASE}/health")
    print('Health:', r.status_code, r.text)

def signup(email, password, name="Test User", role="recruiter"):
    payload = {
        "name": name,
        "email": email,
        "password": password,
        "role": role,
        "applied_role": "Backend Engineer"
    }
    r = requests.post(f"{BASE}/api/auth/signup", json=payload)
    print('Signup status:', r.status_code)
    print('Signup response:', r.text)
    if r.status_code == 200:
        return r.json()["access_token"]
    return None

def login(email, password):
    payload = {"email": email, "password": password}
    r = requests.post(f"{BASE}/api/auth/login", json=payload)
    print('Login status:', r.status_code)
    print('Login response:', r.text)
    if r.status_code == 200:
        return r.json()["access_token"]
    return None

if __name__ == "__main__":
    health_check()
    test_email = f"test_{int(time.time())}@example.com"
    token = signup(test_email, "Password123!")
    if token:
        print('Signup token obtained')
    token2 = login(test_email, "Password123!")
    if token2:
        print('Login token obtained')
