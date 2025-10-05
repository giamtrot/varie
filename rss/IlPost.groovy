@Grab('org.jsoup:jsoup:1.17.2')
import org.jsoup.Jsoup
import java.text.SimpleDateFormat
import groovy.xml.MarkupBuilder
import groovy.json.JsonSlurper

// final RSS_DIR = /C:\Users\giamt\Documents\GitHub\varie\rss/ + "\\"

final RSS_DIR = "./rss/"

def urls = [
    "https://www.ilpost.it/podcasts/morning/",
    "https://www.ilpost.it/podcasts/altre-indagini/",
    "https://www.ilpost.it/podcasts/ci-vuole-una-scienza/",
    "https://www.ilpost.it/podcasts/globo/",
    "https://www.ilpost.it/podcasts/orazio/",
    "https://www.ilpost.it/podcasts/basaglia-e-i-suoi/",
    "https://www.ilpost.it/podcasts/l-ombelico-di-un-mondo/",
    "https://www.ilpost.it/podcasts/15-anni/",
    "https://www.ilpost.it/podcasts/una-mattina/",
    "https://www.ilpost.it/podcasts/wilson/",
    "https://www.ilpost.it/podcasts/un-vocale-lungo/",
    "https://www.ilpost.it/podcasts/live-baricco/",
    "https://www.ilpost.it/podcasts/digital-requiem/",
    "https://www.ilpost.it/podcasts/sonar/",
    "https://www.ilpost.it/podcasts/tienimi-bordone/",
    "https://www.ilpost.it/podcasts/strade-blu/",
    "https://www.ilpost.it/podcasts/colonne/",
    "https://www.ilpost.it/podcasts/tienimi_morning/",
]

def apis = [
    "https://api-prod.ilpost.it/podcast/v1/podcast/strade-blu?&pg=2&hits=20"
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
    def nextData = doc.select("#__NEXT_DATA__").html()
    def jsonNextData = jsonSlurper.parseText(nextData)

    def podcast_title = jsonNextData.props.pageProps.data.data.podcast.data.title
    println "podcast_title: $podcast_title"

    jsonNextData.props.pageProps.data.data.episodes.data.each{ episode ->
        def episode_raw_url = episode.episode_raw_url
        def episode_title = episode.title
        def episode_date = episode.date

        println "episode: $episode_raw_url"
        println "title: $episode_title"
        println "date: $episode_date"

        if (episode_raw_url == "") {
            println "Private Episode"
            return
        }

        if (list.find { it.src == episode_raw_url }) {
            println "$episode_raw_url -> Already in list"
            return
        }

        def element = [
            src: episode_raw_url,
            title: episode_title,
            date: dateFormatter.format(dateReader.parse(episode_date)),
            podcast: podcast_title
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
    // System.exit(0)
}
// System.exit(0)

apis.each{ inUrl->
    println "podcast: $inUrl"
    def json = jsonSlurper.parseText(new URL(inUrl).text)

    json.data.each { episode ->
        println "episode: ${episode.episode_raw_url}"
        if (list.find { it.src == episode.episode_raw_url }) {
            println "Already in list"
            return
        }

        def element = [
            src: episode.episode_raw_url,
            title: episode.title,
            date: episode.date,
            podcast: episode.parent.title
        ]

        list << element
        println "$element"
    }
}

list.sort { a, b -> dateFormatter.parse(a.date) <=> dateFormatter.parse(b.date) }
mapFile.write(groovy.json.JsonOutput.prettyPrint(groovy.json.JsonOutput.toJson(list)))

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
