const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function geocode(location: {
  street: string;
  city: string;
  state: string;
  postal_code: string;
}) {
  const address = [
    location.street,
    location.city,
    location.state,
    location.postal_code,
    "India",
  ]
    .filter(Boolean)
    .join(", ");

  const url =
    `https://maps.googleapis.com/maps/api/geocode/json` +
    `?address=${encodeURIComponent(address)}&key=${GOOGLE_PLACES_API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== "OK") throw new Error(json.status);
  const r = json.results[0];
  const { lat, lng } = r.geometry.location;
  console.log(lat, lng);

  return {
    latitude: lat,
    longitude: lng,
  };
}

export async function reverseGeocode(latitude: number, longitude: number) {
  const url =
    `https://maps.googleapis.com/maps/api/geocode/json` +
    `?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}&language=en`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== "OK") throw new Error(json.status);
  const r = json.results[0];
  const comps: any[] = r.address_components || [];
  const get = (type: string) =>
    comps.find((c) => c.types.includes(type))?.long_name;
  const shortName =
    get("sublocality_level_1") ||
    get("sublocality") ||
    get("route") ||
    get("locality") ||
    get("administrative_area_level_2");

  const street =
    get("route") ||
    get("neighborhood") ||
    get("sublocality_level_1") ||
    get("sublocality");

  const city = get("locality") || get("administrative_area_level_2");
  return {
    latitude,
    longitude,
    displayName: [shortName, city].join(", "),
    shortName,
    street,
    city: city,
    state: get("administrative_area_level_1"),
    country: get("country"),
    postalCode: get("postal_code"),
  };
}
