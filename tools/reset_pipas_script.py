import requests
import json

base_url = "http://localhost:8000/api/v1"

def reset_pipas():
    # 1. Login to get token
    print("Logging in as Melisa...")
    login_data = {
        "username": "melisa@gmail.com",
        "password": "Test123@"
    }
    r = requests.post(f"{base_url}/auth/login", data=login_data)
    if r.status_code != 200:
        print(f"Login failed: {r.text}")
        return
    
    token = r.json()["access_token"]
    print(f"Login successful. Token: {token[:20]}...")

    # 2. Call admin reset
    print("Calling admin reset-pipas...")
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.post(f"{base_url}/operaciones/admin/reset-pipas", headers=headers)
    
    if r.status_code == 200:
        print(f"Reset successful: {json.dumps(r.json(), indent=2)}")
    else:
        print(f"Reset failed: {r.status_code} - {r.text}")

if __name__ == "__main__":
    reset_pipas()
