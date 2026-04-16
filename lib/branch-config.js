const asNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeTime = (value) => {
  const raw = String(value || "")
    .trim()
    .replace(".", ":");
  if (!raw) return null;

  const [hoursRaw, minutesRaw] = raw.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
};

const getCurrentMinutesForTimeZone = (now, timeZone) => {
  const date = now instanceof Date ? now : new Date(now);
  if (!timeZone) {
    return date.getHours() * 60 + date.getMinutes();
  }

  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);
    if (Number.isFinite(hour) && Number.isFinite(minute)) {
      return hour * 60 + minute;
    }
  } catch {
    // Fallback to server-local time if timezone parsing fails.
  }

  return date.getHours() * 60 + date.getMinutes();
};

export const normalizeBranchConfigs = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const isBranchOpenNow = (branch, now = new Date()) => {
  if (!branch) return false;
  if (branch?.isActive === false || branch?.isTemporarilyClosed === true) {
    return false;
  }

  const operatingHours = branch?.operatingHours;
  if (!operatingHours) return true;
  if (operatingHours?.is24Hours) return true;

  const openMinutes = normalizeTime(operatingHours?.open);
  const closeMinutes = normalizeTime(operatingHours?.close);
  if (openMinutes == null || closeMinutes == null) return true;

  const currentMinutes = getCurrentMinutesForTimeZone(
    now,
    operatingHours?.timezone
  );

  if (openMinutes < closeMinutes) {
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  if (openMinutes === closeMinutes) {
    return true;
  }

  return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
};

export const isBranchAvailableForOrdering = (branch, now = new Date()) =>
  isBranchOpenNow(branch, now);

export const getBranchDeliveryFee = (branch) =>
  asNumber(branch?.delivery?.fee, 0);

export const getBranchBySpotId = (branches, spotId) => {
  const normalizedSpotId = String(spotId || "").trim();
  if (!normalizedSpotId) return null;
  return (
    branches.find((branch) => String(branch?.spotId) === normalizedSpotId) ||
    null
  );
};

const toRadians = (value) => (value * Math.PI) / 180;

export const calculateDistanceKm = (fromLat, fromLng, toLat, toLng) => {
  const lat1 = asNumber(fromLat, NaN);
  const lng1 = asNumber(fromLng, NaN);
  const lat2 = asNumber(toLat, NaN);
  const lng2 = asNumber(toLng, NaN);

  if (!Number.isFinite(lat1) || !Number.isFinite(lng1)) return Infinity;
  if (!Number.isFinite(lat2) || !Number.isFinite(lng2)) return Infinity;

  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

export const selectNearestBranch = (
  branches,
  lat,
  lng,
  { preferOpen = true } = {}
) => {
  const enriched = (Array.isArray(branches) ? branches : [])
    .map((branch) => ({
      branch,
      distance: calculateDistanceKm(
        lat,
        lng,
        branch?.location?.latitude,
        branch?.location?.longitude
      ),
    }))
    .filter((item) => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance);

  if (enriched.length === 0) return null;

  if (preferOpen) {
    const nearestOpen = enriched.find((item) =>
      isBranchAvailableForOrdering(item.branch)
    );
    if (nearestOpen) return nearestOpen.branch;
  }

  return enriched[0].branch;
};

export const getBranchDisplayName = (branch, locale = "en") => {
  if (!branch?.name) return "";
  return (
    branch.name?.[locale] ||
    branch.name?.ru ||
    branch.name?.en ||
    branch.name?.uz ||
    ""
  );
};

export const getBranchDisplayAddress = (branch, locale = "en") => {
  if (!branch?.location?.address) return "";
  return (
    branch.location.address?.[locale] ||
    branch.location.address?.ru ||
    branch.location.address?.en ||
    branch.location.address?.uz ||
    ""
  );
};

export const getBranchPhone = (branch) => branch?.contact?.phone || "";
