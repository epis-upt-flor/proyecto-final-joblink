import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

export const particlesInit = async (engine: Engine) => {
  await loadFull(engine);
};