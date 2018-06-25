import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueExample {
public static void main(String[] args) {
	BlockingQueue blockingQueue = new ArrayBlockingQueue<>(10);
	ThreadClass2 td = new ThreadClass2("test", blockingQueue);
	Thread td2 = new Thread(td);
	td2.start();
}
}


class ThreadClass2 implements Runnable{

	private String value ;
	private BlockingQueue blockingQueue =null;
	
	public ThreadClass2(String value,BlockingQueue blockingQueue) {
		this.value = value;
		this.blockingQueue = blockingQueue;
	}
	
	@Override
	public void run() {
		for (int i = 1; i <=50; i++) {
			 try {
			blockingQueue.put("item"+i);
		  System.out.println("Fetching "+i+" data from "+value+" by "+Thread.currentThread().getName());
		 
			Thread.sleep(500);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} // Reading file
		  
		   System.out.println("Read file successfully: "+value+" by "+Thread.currentThread().getName());
		}
	}

}

