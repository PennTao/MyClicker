package com.google.appengine.myclicker;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.channel.ChannelFailureException;
import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;

@SuppressWarnings("serial")
public class InstructorServlet extends HttpServlet {
	 private static final Logger logger = Logger.getLogger(StudentServlet.class.getCanonicalName());
	  
	  private static ChannelService channelService = ChannelServiceFactory.getChannelService();

	  private HashMap<String,String> mapStuAns = new HashMap<String,String>();
	  private int[] result = new int[4];
	  /**
	   * Check the incoming parameters and create the channel message . 
	   * Send "OFFLINE" reply in case of an exception such as the user channel do not exist
	   */
	  protected void doPost(HttpServletRequest request, HttpServletResponse response)
	  throws ServletException, IOException {
		String channelID = request.getParameter("channel");
	    String message = request.getParameter("message");
	    String user = request.getParameter("to");
	    String from = request.getParameter("from");
	    logger.log(Level.WARNING, "message: " + message);
	    if(message.equals("clear_all") ){
	    	logger.log(Level.WARNING, "data cleared");
	    	mapStuAns.clear();
	    }
	    if (user != null && !user.equals("") && message != null
	        && !message.equals("")) {
	      try{
	    	  mapStuAns.put(user, message);
	      	String outputMessage ="<data>" +
			  "<type>AnswerReceived</type>" +"<channel>" + channelID +"</channel>" + 
			  "<message>"+ message + "</message>" +
			  "<from>"+from+"</from>" +
			  "</data>"; 
	     
	        logger.log(Level.INFO,"Instructor sending message  into the channel");

	      	sendMessageToChannel(user, outputMessage);
	      } catch (ChannelFailureException channelFailure) {
	      	logger.log(Level.WARNING, "Failed in sending message to channel");
	        response.getWriter().print("OFFLINE");
	      } catch (Exception e) {
	        logger.log(Level.WARNING, "Unknow error while sending message to the channel");
	        response.getWriter().print("OFFLINE");
	      }
	      try{
	    	  	updateResult();
	    	    logger.log(Level.INFO,"Instructor sending update info into the channel");
		      	String dispData ="<data>"+ "<type>updateResult</type>" +"<channel>" + 
		      	channelID +"</channel>"+ "<ansA>" + result[0] + "</ansA>"+"<ansB>" + result[1] + "</ansB>"+
		      	"<ansC>" + result[2] + "</ansC>"+ "<ansD>" + result[3] + "</ansD>"+
		      	"</data>";
		      	sendMessageToChannel(from, dispData);
	      }catch (ChannelFailureException channelFailure) {
		      	logger.log(Level.WARNING, "Failed in sending message to channel");
		        response.getWriter().print("OFFLINE");
		      } catch (Exception e) {
		        logger.log(Level.WARNING, "Unknow error while sending message to the channel");
		        response.getWriter().print("OFFLINE");
		      }
	    }

	  }
	  public void sendMessageToChannel(String user,String message) throws ChannelFailureException{
		  	channelService.sendMessage(new ChannelMessage(user, message));
		  	}
	  public void updateResult(){
		  for(int i =0; i < 4; i++)
		  {
			  result[i] = 0;
		  }
		 for(String key : mapStuAns.keySet())
		 {
			 logger.log(Level.WARNING, "key:" + key + "value:" + mapStuAns.get(key));
			 switch(mapStuAns.get(key)){
				 case "A":
					 result[0]++;
					 break;
				 case "B":
					 result[1]++;
					 break;
				 case "C":
					 result[2]++;
					 break;
				 case "D":
					 result[3]++;
					 break;
				default:
					break;
			 }
			
		 }
		 
	  }

}
