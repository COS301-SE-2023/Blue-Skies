export default class ILocationData {
  latitude: number;
  longitude: number;
  locationName: string;
  solarPanelsData: string;
  satteliteImageData: number[];
  satteliteImageElevationData: number[];
  annualFluxData: number[];
  monthlyFluxData: number[];
  maskData: number[];
  dateCreated: Date;
  daylightHours: number;
  horisonElevationData: string;
}
