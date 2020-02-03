package MultiThreading;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class Blockingqueue {
	
	public static void main(String[] args) {
		BlockingQueue queue=new ArrayBlockingQueue(10);
		  Producer producer=new Producer(queue);
		  Consumer consumer=new Consumer(queue);
		  new Thread(producer).start();
		  new Thread(consumer).start();
	}

}
class Consumer implements Runnable{
	
	BlockingQueue blockingQueue;
	
	public Consumer(BlockingQueue blockingQueue) {
		this.blockingQueue = blockingQueue;
	}

	@Override
	public void run() {
		 while(true)
		  {
		   try {
		    System.out.println("Consumed "+blockingQueue.take());
		   } catch (InterruptedException e) {
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		   }
		  }
		
	}
	
}

class Producer implements Runnable{
	
	BlockingQueue blockingQueue;
	
	public Producer(BlockingQueue blockingQueue) {
		this.blockingQueue = blockingQueue;
	}

	@Override
	public void run() {
		
		for (int i = 0; i < 50; i++) {
			try {
				blockingQueue.put("Produced item "+i);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
}
