namespace BlazorApp.Data {
    public class TooltipService
    {
        private Dictionary<string, string> tooltips = new Dictionary<string, string>();

        public TooltipService()
        {
            tooltips["solarScore"] = "The percentage of sunlight exposure on your property's roof compared to an optimal roof.";
            tooltips["potential savings"] = "How much money you can save monthly by producing clean energy.";
            tooltips["average energy produced"] = "The daily energy your solar panels produce averaged over a year.";
            tooltips["running hours on batteries"] = "The total time in which you can run the chosen appliances exclusively using battery power.";
            tooltips["battery utilisation"] = "The maximum percentage your batteries can charge, while running the selected appliances.";
        }

        public string GetTooltip(string key)
        {
            if(string.IsNullOrEmpty(key))
            {
                return string.Empty;
            }
            if (tooltips.TryGetValue(key, out string? tooltip))
            {
                if (tooltip != null)
                {
                    return tooltip;
                }
            }
            return string.Empty;
        }
    }
}