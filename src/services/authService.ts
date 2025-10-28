import axios from "axios";

const API_BASE_URL = "https://p5crm-backend.vercel.app/api/v1/users";

export async function loginUser(email: string, password: string, role: string) {
  const response = await axios.post(
    `${API_BASE_URL}/login`,
    { email, password, role },
    { withCredentials: true }
  );
  return response.data;
}

export async function createUser(
  token: string,
  email: string,
  password: string,
  roles: string[]
) {
  const response = await axios.post(
    `${API_BASE_URL}/admin/createUser`,
    { email, password, roles },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
