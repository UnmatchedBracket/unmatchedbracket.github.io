import requests as rq
import json
data = rq.get("https://data.iana.org/TLD/tlds-alpha-by-domain.txt").text
data = [i for i in data.split("\n") if (i and i[0] != "#")]
lengths = sorted(set(map(len, data)))
print("{", end="")
for l in lengths:
    print(
        f"\"{l}\":", json.dumps([i for i in data if len(i) == l], separators=",:"),
        sep="", end=","
    )
print("}")