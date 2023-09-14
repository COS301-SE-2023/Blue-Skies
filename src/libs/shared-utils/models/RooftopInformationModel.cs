
public class RooftopInformationModel
{
  public string name { get; set; }
  public Center center { get; set; }
  public Imagerydate imageryDate { get; set; }
  public string regionCode { get; set; }
  public Solarpotential solarPotential { get; set; }
  public Boundingbox1 boundingBox { get; set; }
  public string imageryQuality { get; set; }
  public Imageryprocesseddate imageryProcessedDate { get; set; }
}

public class Center
{
  public float latitude { get; set; }
  public float longitude { get; set; }
}

public class Imagerydate
{
  public int year { get; set; }
  public int month { get; set; }
  public int day { get; set; }
}

public class Solarpotential
{
  public int maxArrayPanelsCount { get; set; }
  public float maxArrayAreaMeters2 { get; set; }
  public float maxSunshineHoursPerYear { get; set; }
  public float carbonOffsetFactorKgPerMwh { get; set; }
  public Wholeroofstats wholeRoofStats { get; set; }
  public Roofsegmentstat[] roofSegmentStats { get; set; }
  public Solarpanelconfig[] solarPanelConfigs { get; set; }
  public int panelCapacityWatts { get; set; }
  public float panelHeightMeters { get; set; }
  public float panelWidthMeters { get; set; }
  public int panelLifetimeYears { get; set; }
  public Buildingstats buildingStats { get; set; }
  public Solarpanel[] solarPanels { get; set; }
}

public class Wholeroofstats
{
  public float areaMeters2 { get; set; }
  public float[] sunshineQuantiles { get; set; }
  public float groundAreaMeters2 { get; set; }
}

public class Buildingstats
{
  public float areaMeters2 { get; set; }
  public float[] sunshineQuantiles { get; set; }
  public float groundAreaMeters2 { get; set; }
}

public class Roofsegmentstat
{
  public float pitchDegrees { get; set; }
  public float azimuthDegrees { get; set; }
  public Stats stats { get; set; }
  public Center1 center { get; set; }
  public Boundingbox boundingBox { get; set; }
  public float planeHeightAtCenterMeters { get; set; }
}

public class Stats
{
  public float areaMeters2 { get; set; }
  public float[] sunshineQuantiles { get; set; }
  public float groundAreaMeters2 { get; set; }
}

public class Center1
{
  public float latitude { get; set; }
  public float longitude { get; set; }
}

public class Boundingbox
{
  public Sw sw { get; set; }
  public Ne ne { get; set; }
}

public class Sw
{
  public float latitude { get; set; }
  public float longitude { get; set; }
}

public class Ne
{
  public float latitude { get; set; }
  public float longitude { get; set; }
}

public class Solarpanelconfig
{
  public int panelsCount { get; set; }
  public float yearlyEnergyDcKwh { get; set; }
  public Roofsegmentsummary[] roofSegmentSummaries { get; set; }
}

public class Roofsegmentsummary
{
  public float pitchDegrees { get; set; }
  public float azimuthDegrees { get; set; }
  public int panelsCount { get; set; }
  public float yearlyEnergyDcKwh { get; set; }
  public int segmentIndex { get; set; }
}

public class Solarpanel
{
  public Center2 center { get; set; }
  public string orientation { get; set; }
  public float yearlyEnergyDcKwh { get; set; }
  public int segmentIndex { get; set; }
}

public class Center2
{
  public float latitude { get; set; }
  public float longitude { get; set; }
}

public class Boundingbox1
{
  public Sw1 sw { get; set; }
  public Ne1 ne { get; set; }
}

public class Sw1
{
  public float latitude { get; set; }
  public float longitude { get; set; }
}

public class Ne1
{
  public float latitude { get; set; }
  public float longitude { get; set; }
}

public class Imageryprocesseddate
{
  public int year { get; set; }
  public int month { get; set; }
  public int day { get; set; }
}
