@Grab('org.jsoup:jsoup:1.17.2')
import org.jsoup.Jsoup
import java.text.SimpleDateFormat
import groovy.xml.MarkupBuilder
import groovy.json.JsonSlurper

// final RSS_DIR = /C:\Users\giamt\Documents\GitHub\varie\rss/ + "\\"

final RSS_DIR = "./rss/"

def urls = [
    "https://www.ilpost.it/podcasts/altre-indagini/",
    "https://www.ilpost.it/podcasts/ci-vuole-una-scienza/",
    "https://www.ilpost.it/podcasts/globo/",
    "https://www.ilpost.it/podcasts/morning/",
    "https://www.ilpost.it/podcasts/orazio/",
    "https://www.ilpost.it/podcasts/basaglia-e-i-suoi/",
    "https://www.ilpost.it/podcasts/l-ombelico-di-un-mondo/",
    "https://www.ilpost.it/podcasts/15-anni/",
]

def outFile = RSS_DIR + "IlPost.xml"

def dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.ENGLISH)
def dateReader = new SimpleDateFormat("dd MMM yyyy", Locale.ITALIAN)

def jsonSlurper = new JsonSlurper()

// Save the list to disk
def mapFile = new File(RSS_DIR + "IlPost.map.json")

// Load the list from disk if it exists
def list = []
if (mapFile.exists()) {
    list = jsonSlurper.parseText(mapFile.text)
}
list.sort { a, b -> dateFormatter.parse(a.date) <=> dateFormatter.parse(b.date) }

urls.each{ inUrl->

    println "podcast: $inUrl"
    def doc = Jsoup.connect(inUrl).get()
    // def divs = doc.select("main.container > div")
    def divs = doc.select("main.container > div[class*=\"_episode-item_\"]")
    divs.each{ div->
        def link = div.select("h3 > a").first()
        def url = link.attr("href")
        println "episode: $url"
        def episodeDoc = Jsoup.connect(url).get()
        // println episode
        def jsonData = episodeDoc.select("script").find { it.attr("type") == "application/json" }.html()
        // println data
        def json = jsonSlurper.parseText(jsonData)
        def episode = json.props.pageProps.data.data.episode.data

        if (list.find { it.src == episode.episode_raw_url[0] }) {
            println "Already in list"
            return
        }

        // println "${episode.date[0]}"
        // println "${dateReader.parse(episode.date[0])}"
        // println "${dateFormatter.format(dateReader.parse(episode.date[0]))}"
        def element = [
            src: episode.episode_raw_url[0],
            title: episode.title[0],
            date: dateFormatter.format(dateReader.parse(episode.date[0])),
            podcast: episode.parent.title[0]
        ]
        if (element.title.endsWith("Seconda parte")) {
            // println element.title
            def dateStr = element.date
            def date = dateFormatter.parse(dateStr)
            date.hours += 1
            element.date = dateFormatter.format(date)
        }
        list << element
        println "$element"
        // System.exit(0)
    }

}

list.sort { a, b -> dateFormatter.parse(a.date) <=> dateFormatter.parse(b.date) }
mapFile.write(groovy.json.JsonOutput.toJson(list))

def xmlWriter = new StringWriter()
def xmlMarkup = new MarkupBuilder(xmlWriter)

xmlMarkup.rss {
    channel {
        title("I Podcast del Post")
        image {
            url("https://www.ilpost.it/wp-content/uploads/2021/05/evening-1.png")
            title("I Podcast del Post")
            link("https://www.ilpost.it")
        }
        list.each{ element->
            'item' {
                def fullTitle = element.podcast + " - " + element.title
                //                 println urlAudio
                title(fullTitle)
                link(element.src)
                description(fullTitle)
                enclosure(type: "audio/mpeg", url:element.src)
                // pubDate(formatter.format(element.date))
                pubDate(element.date)
                guid(element.src)
            }
        }
    }
}

// println  xmlWriter.toString()
def rss = new File(outFile)
println rss.getAbsolutePath()
rss.write( xmlWriter.toString() )
