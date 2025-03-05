@Grab('org.jsoup:jsoup:1.17.2')
// @Grab('org.ccil.cowan.tagsoup:tagsoup:1.2')

import org.jsoup.Jsoup
import groovy.json.JsonSlurper

final RSS_DIR = "./"

def baseUrl = new URI("https://www.raiplaysound.it/programmi/adaltavoce/audiolibri")
def document
try {
	document = Jsoup.connect(baseUrl.toString()).timeout(10000).get()
}
catch (SocketTimeoutException e) {
	println "Timeout connecting to $baseUrl"
	return
}


def articles = document.select("article > a").eachAttr("href")

articles.forEach{ href -> {
	def article = baseUrl.resolve(href).toString() + ".json"
	println article
	def book = new JsonSlurper().parse(new URL(article))
	def bookTitle = book.title
	println bookTitle
}}

        

