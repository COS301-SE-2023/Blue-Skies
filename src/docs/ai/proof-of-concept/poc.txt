#Run with command: 'py ./src/docs/ai/proof-of-concept/poc.py' from project directory

#Map center: Map.setCenter(30.0, -28.94, 5.5);
#Increments of 7 days

from colorthief import ColorThief
from PIL import Image
import matplotlib.pyplot as plt

sa = ColorThief('./src/docs/ai/proof-of-concept/SouthAfrica_20181201-20181205.jpg')
jhb = ColorThief('./src/docs/ai/proof-of-concept/SouthAfricaJohannesburg_20181201-20181205.jpg')

def get_dominant_color(image, num_colors=1, quality=1):
    palette = image.get_palette(color_count=num_colors, quality=quality)
    plt.imshow([[palette[i] for i in range(num_colors)]])
    plt.show()



print("For display purposes, We will use the data of the heatmap colours for South africa")
saimg = Image.open('./src/docs/ai/proof-of-concept/SouthAfrica_20181201-20181205.jpg')
input("Press Enter to continue...")
saimg.show()
print("This will have the dominant colours:")
get_dominant_color(sa, 5)

print("However, the data we will use will look much closer to this heat map. This is the data for Johannesburg, which is used as an example")
input("Press Enter to continue...")
jhbimg = Image.open('./src/docs/ai/proof-of-concept/SouthAfricaJohannesburg_20181201-20181205.jpg')
jhbimg.show()
print("This will have the dominant colours:")
get_dominant_color(jhb, 5)
print("As you can see, the dominant colours are much closer to each other, hence why we will use the average colour of the 5 most dominant colours of heatmap for displaying purposes")

input("Press Enter to continue...")
print("As you can see, the data from the entirety of south afdrica is much more varied than the data from Johannesburg, which is why we will be using this data for display purposes")



# get_dominant_color(jhb)

# get_dominant_color(sa, 5)
