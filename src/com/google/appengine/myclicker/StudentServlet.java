package com.google.appengine.myclicker;

import java.io.IOException;
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
public class StudentServlet extends HttpServlet {
	  
	  private static final Logger logger = Logger.getLogger(StudentServlet.class.getCanonicalName());
	  
	  private static ChannelService channelService = ChannelServiceFactory.getChannelService();

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
	    if (user != null && !user.equals("") && message != null
	        && !message.equals("")) {
	      try{
	      	String outputMessage ="<data>" +
			  "<type>StudentAnswer</type>" + "<channel>" + channelID + "</channel>" + 
			  "<message>"+message+"</message>" +
			  "<from>"+from+"</from>" +
			  "</data>"; 
	      		
	        logger.log(Level.INFO,"Student sending message  into the channel");
	        logger.log(Level.INFO,"TO: "+user);
	        logger.log(Level.INFO,"FROM: "+from);
	        logger.log(Level.INFO,"MSG: "+ message);
	      	sendMessageToChannel(user, outputMessage);
	      } catch (ChannelFailureException channelFailure) {
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
}
