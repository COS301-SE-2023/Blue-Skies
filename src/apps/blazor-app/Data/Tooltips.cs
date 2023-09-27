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
            tooltips["solar score add button"] = "Add or remove appliances";
            tooltips["number of panels"] = "Affects your average energy production and how quickly you can charge your batteries while running appliances.";
            tooltips["number of batteries"] = "Affects how much energy you can store and how long you can run your appliances.";
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
        public string SetCustomTooltip(string tooltip)
        {
        return tooltip;
        }
    }

    
}