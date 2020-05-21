/**
 * Created by greason on 2020/1/7.
 */

function vcsurl(url: string) {
  if (url.indexOf("github.com") >= 0) {
    return parseUrl(url, "github.com");
  } else if (url.indexOf("bitbucket.org") >= 0) {
    return parseUrl(url, "bitbucket.org");
  } else {
    return url.replace(".git", "");
  }
}

function parseUrl(url: string, site: string) {
  var pos = url.indexOf(site) + site.length + 1; //+1 => chop either ':' or '/'
  var repo = url.substring(pos);

  repo = repo.replace(".git", "");

  var data = repo.split("/");

  return "https://" + site.toString() + "/" + data[0] + "/" + data[1];
}

export = { vcsurl };
