var revision = [];

function rev(added, deleted, belonged, derived, revnum) 
{
    this.added = added;
    this.deleted = deleted;
    this.belonged = belonged;
    this.derived = derived;
    this.revnum = revnum;
}

function addRevison(added,deleted,belonged,derived,revnum)
{    
  var r = new rev(added,deleted,belonged,derived,revnum);
  revision.push(r);
}

function revnum(txt)
{   revision = [];
	var lgnt = txt.length;
	var count = 0;
	var pos = 0;
	var temp = 0;
	var i = 0;
	
	// cleaning the text from white characters
	txt = txt.replace(/ /g, "");			//erase spaces
	txt = txt.replace(/&lt;/g, "");			//erase <
	txt = txt.replace(/&gt;/g, "");			//erase >
	txt = txt.replace(/&quot;/g, "");		//erase "
	
	// finding the number of the rev
	for (i = 0; i < lgnt; i++)
	{
		pos = txt.indexOf("rmo:revisionNumber", temp);
		if (pos != -1)
		{
		    temp = pos + 1;
		    count++;
		}
	}
	
	return count;
}

function parse(txt, revcount)
{
  // finding the revision info
  var temptxt = 0;
  var pos1 = 0;
  var pos2 = 0;

  var added 	= "-1";
  var belonged	= "-1";
  var deleted	= "-1";
  var revnum	= "-1";
  var derived	= "-1";

  // cleaning the text from white characters
  txt = txt.replace(/ /g, "");			//erase spaces
  txt = txt.replace(/&lt;/g, "");		//erase <
  txt = txt.replace(/&gt;/g, "");		//erase >
  txt = txt.replace(/&quot;/g, "");		//erase "

  txt = txt.split("armo:Revision;");	// converting the text into array

  for (i = 1; i <= revcount; i++)
  {
    temptxt = txt[i];
    
    pos1 = temptxt.indexOf("rmo:addSet", pos2);
    if (pos1 != -1)
    {
      pos2 = temptxt.indexOf(";", (pos1 + 11));
      added = temptxt.slice((pos1 + 11), (pos2 - 1));
    }
    else
    {
      added = "-1";
    }

    pos1 = temptxt.indexOf("rmo:belongsTo", pos2);
    if (pos1 != -1)
    {
      pos2 = temptxt.indexOf(";", (pos1 + 14));
      belonged = temptxt.slice((pos1 + 14), (pos2 - 1));
    }
    else
    {
      belonged = "-1";
    }

    pos1 = temptxt.indexOf("rmo:deleteSet", pos2);
    if (pos1 != -1)
    {
      pos2 = temptxt.indexOf(";", (pos1 + 14));
      deleted = temptxt.slice((pos1 + 14), (pos2 - 1));
    }
    else
    {
      deleted = "-1";
    }

    pos1 = temptxt.indexOf("rmo:revisionNumber", pos2);
    if (pos1 != -1)
    {
      revnum = i - 1;
    }
    else
    {
      revnum = "-1";
    }

    pos1 = temptxt.indexOf("rmo:wasDerivedFrom", pos2);
    if (pos1 != -1)
    {
      pos2 = temptxt.indexOf(".armo", (pos1 + 18));
      derived = temptxt.slice((pos1 + 18), (pos2 - 1));
    }
    else
    {
      derived = "-1";
    }    
	
    pos2 = 0;
    addRevison(added,deleted,belonged,derived,revnum);
  }
    return revision
}