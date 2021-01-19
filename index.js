const axios = require('axios');

var serviceRoot = 'https://services.odata.org/v4/TripPinService';

const instance = axios.create({
  baseURL: serviceRoot,
  timeout: 10000
});

async function listPeople(username) {
  const url = `/People?$filter=UserName eq '${username}'`;
  const resp = await instance.get(url);
  return resp.data.value.map(item => item.FirstName + ' ' + item.LastName);
}

async function createPerson(data) {
  const resp = await instance.post('/People', data);
  return resp.data;
}

async function deletePerson(username) {
  const resp = await instance.delete(`/People('${username}')`);
  return resp.data;
}

async function searchAirports(term) {
  const url = `/Airports?$filter=contains(Location/Address, '${term}')`;
  const resp = await instance.get(url);
  return resp.data.value.map(item => item.Name);
}

async function main() {
  const createdPerson = await createPerson({
    "UserName": "Henry",
    "FirstName": "Henry",
    "LastName": "Thompson",
    "Gender": "Female"
  });

  console.log("The created person:", createdPerson.UserName);

  const people = await listPeople('Henry');
  console.log("list people with UserName eq 'Henry':", people);


  const airports = await searchAirports('District');
  console.log("The airports that address contains 'District':", airports);

  try {
    await deletePerson('Henry');
    console.log("Successfully deleted")
  } catch (e) {
    console.error("There was an error deleting:", e.message);
  }
}

main()
