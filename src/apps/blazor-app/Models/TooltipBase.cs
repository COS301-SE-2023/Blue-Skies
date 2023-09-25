// using Microsoft.AspNetCore.Components;

// public class TooltipBase : ComponentBase
// {
//     [Parameter]
//     public RenderFragment? ChildContent { get; set; }

//     [Parameter]
//     public string? Position { get; set; } = "top";

//     protected string PositionClass => GetPositionClass(Position!);

//     protected RenderFragment? ChildContentWithoutTooltip { get; set; }

//     protected override void OnParametersSet()
//     {
//         ChildContentWithoutTooltip = ChildContent;
//     }

//     protected string GetPositionClass(string position)
//     {
//         switch (position)
//         {
//             case "top":
//                 return "-top-3 -translate-x-1/2 left-1/2 transform -translate-y-full";
//             case "bottom":
//                 return "bottom-3 -translate-x-1/2 left-1/2 transform translate-y-full";
//             case "left":
//                 return "-left-3 -translate-y-1/2 top-1/2 transform -translate-x-full";
//             case "right":
//                 return "right-3 -translate-y-1/2 top-1/2 transform translate-x-full";
//             default:
//                 return "-top-3 -translate-x-1/2 left-1/2 transform -translate-y-full";
//         }
//     }
// }
