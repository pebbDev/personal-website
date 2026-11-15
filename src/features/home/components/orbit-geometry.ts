// Compatibility entrypoint for the committed legacy geometry test.
// The implementation and type ownership remain in OrbitRing/.
// Remove this adapter when the tracked tests are migrated in a separate test change.
export { getOrbitLayout, getOrbitCardState } from "./OrbitRing/geometry";
